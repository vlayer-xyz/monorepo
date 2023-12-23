import barretenbergModule from '../../barretenberg.wasm';
import barretenbergThreadsModule from '../../barretenberg-threads.wasm';
// Annoyingly the wasm declares if it's memory is shared or not. So now we need two wasms if we want to be
// able to fallback on "non shared memory" situations.
export async function fetchCode(multithreaded) {
    const res = await fetch(multithreaded ? barretenbergThreadsModule : barretenbergModule);
    return await res.arrayBuffer();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYmFycmV0ZW5iZXJnX3dhc20vZmV0Y2hfY29kZS9icm93c2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sa0JBQWtCLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyx5QkFBeUIsTUFBTSxpQ0FBaUMsQ0FBQztBQUV4RSwwR0FBMEc7QUFDMUcsc0RBQXNEO0FBQ3RELE1BQU0sQ0FBQyxLQUFLLFVBQVUsU0FBUyxDQUFDLGFBQXNCO0lBQ3BELE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDeEYsT0FBTyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNqQyxDQUFDIn0=